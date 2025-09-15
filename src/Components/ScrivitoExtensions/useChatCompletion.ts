import { OpenAI } from 'openai'
import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from 'openai/resources'
import { Stream } from 'openai/streaming'
import { useMemo, useState } from 'react'
import { getInstanceId, performWithIamToken } from 'scrivito'

const GEN_AI_BASE_URL =
  'https://6dyoi7w4yzq2bta2fh5hubtd4a0lnozo.lambda-url.eu-central-1.on.aws'
const model = 'aws/eu.anthropic.claude-sonnet-4-20250514-v1:0'

export function useChatCompletion() {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])
  const [loading, setLoading] = useState(false)
  const [completionMessage, setCompletionMessage] =
    useState<ChatCompletionMessage | null>(null)

  const messagesWithCompletion = useMemo(
    () => (completionMessage ? messages.concat(completionMessage) : messages),
    [messages, completionMessage],
  )

  const instanceId = getInstanceId()

  return {
    loading,
    messages: messagesWithCompletion,
    submitPrompt: (prompt: ChatCompletionMessageParam[]) => {
      setCompletionMessage(null)
      setLoading(true)
      setMessages((m: ChatCompletionMessageParam[]) => {
        const messagesWithPrompt = [...m, ...prompt]
        startStreaming({
          instanceId,
          model,
          messages: messagesWithPrompt,
          setCompletionMessage,
          setLoading,
          setMessages,
        })
        return messagesWithPrompt
      })
    },
    abortResponse: () => {},
    resetMessages: () => {
      setCompletionMessage(null)
      setMessages([])
    },
    setMessages,
  }
}

async function startStreaming({
  instanceId,
  messages,
  model,
  setCompletionMessage,
  setLoading,
  setMessages,
}: {
  instanceId: string
  messages: ChatCompletionMessageParam[]
  setCompletionMessage: (message: ChatCompletionMessage | null) => void
  setLoading: (loading: boolean) => void
  setMessages: (messages: ChatCompletionMessageParam[]) => void
  model: string
}) {
  let content = ''
  let message: ChatCompletionMessage | null = null
  let finishReason
  let role = null

  do {
    const client = new OpenAI({
      apiKey: '',
      baseURL: `${GEN_AI_BASE_URL}/v1`,
      defaultQuery: { instance_id: instanceId },
      dangerouslyAllowBrowser: true,
      fetch: async (url, init) => {
        return performWithIamToken<Response>(
          'https://api.justrelate.com/ai',
          async (token) => {
            // we assume that the OpenAI library always gives us the headers as an object
            const givenHeaders = init?.headers as Record<string, string>

            const result = await fetch(url, {
              ...init,
              headers: {
                ...cleanHeaders(givenHeaders),
                authorization: `Bearer ${token}`,
              },
            })

            if (result.status === 401) {
              const errorResponse = await result.json()

              if (
                'code' in errorResponse &&
                errorResponse.code === 'auth_missing'
              ) {
                return { authenticationFailed: errorResponse }
              }
            }

            return { result }
          },
        )
      },
      maxRetries: 10,
    })

    finishReason = null
    let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>

    try {
      stream = await client.chat.completions.create({
        model,
        messages: message ? messages.concat(message) : messages,
        stream: true,
      })
    } catch (error) {
      setCompletionMessage(null)
      setMessages(
        messages.concat({
          role: 'assistant',
          content:
            error instanceof Error ? error.toString() : JSON.stringify(error),
          refusal: null,
        }),
      )
      setLoading(false)
      return
    }

    for await (const chunk of stream) {
      const { delta, finish_reason } = chunk.choices[0]
      finishReason = finish_reason
      role ||= delta.role

      if (role === 'assistant' && delta.content) {
        content += delta.content
        setCompletionMessage({
          role: 'assistant',
          content,
          refusal: delta.refusal || null,
        })
      }
      message = {
        role: 'assistant',
        content,
        refusal: delta.refusal || null,
      }
    }
  } while (finishReason === 'length' && content.length < MAX_OUTPUT_TOKENS * 4)

  setCompletionMessage(null)
  if (message) setMessages(messages.concat(message))
  setLoading(false)
}

const MAX_OUTPUT_TOKENS = 32_000

function cleanHeaders(
  headers: Record<string, string> = {},
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).filter(([k]) => {
      if (k.startsWith('x-')) {
        return false
      }
      return true
    }),
  )
}
