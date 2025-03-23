import Anthropic from '@anthropic-ai/sdk';
import { TextBlock } from '@anthropic-ai/sdk/resources/index.mjs';
import { ChatGPTAPI, ChatGPTError, ChatMessage } from 'chatgpt';

export type SettingsResponse = {
  // TODO: check
  [key: string]: unknown;
  api_chat_gpt: string;
  api_claude: string;
  chat_gpt_model: string;
  claude_model: string;
  created_at: string;
  default_model: string;
  evening_prompt: string;
  evening_text_after: string;
  evening_text_before: string;
  evening_text_block_header: string;
  evening_text_header: string;
  id: number;
  morning_prompt: string;
  morning_text_after: string;
  morning_text_before: string;
  morning_text_block_header: string;
  morning_text_header: string;
  news_header_prompt: string;
  news_prompt: string;
  tones: string;
  updated_at: string;

  weather_prompt: string;
};

export const getSettings = async (): Promise<SettingsResponse | null> => {
  const formData = new FormData();
  formData.append('action', 'get_settings');
  formData.append('_ajax_nonce', wp_ajax_obj.nonce);

  try {
    const response = await fetch(wp_ajax_obj.ajax_url, {
      body: formData,
      credentials: 'same-origin',
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to get tones');
    }

    return await response.json();
  } catch {
    return null;
  }
};

export const createNewsDraft = async (
  formData: FormData,
): Promise<number | null> => {
  formData.append('action', 'create_news_draft');
  formData.append('_ajax_nonce', wp_ajax_obj.nonce);

  try {
    const response = await fetch(wp_ajax_obj.ajax_url, {
      body: formData,
      credentials: 'same-origin',
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to get tones');
    }

    return await response.json();
  } catch {
    return null;
  }
};

export const createDaytimeDraft = async (
  formData: FormData,
): Promise<number | null> => {
  formData.append('action', 'create_daytime_draft');
  formData.append('_ajax_nonce', wp_ajax_obj.nonce);

  try {
    const response = await fetch(wp_ajax_obj.ajax_url, {
      body: formData,
      credentials: 'same-origin',
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to get tones');
    }

    return await response.json();
  } catch {
    return null;
  }
};

export const getChatGPTResponse = async (
  apiKey: string,
  prompt: string,
  model: string = 'gpt-3.5-turbo',
  onProgress?: ((partialResponse: ChatMessage) => void) | undefined,
) => {
  try {
    if (import.meta.env.MODE === 'development') {
      console.warn('Using mocked response for ChatGPT');
      const mockedResponse = `Mocked ChatGPT response for prompt: "${prompt}" using model: "${model}"`;
      onProgress?.({ text: mockedResponse } as ChatMessage);
      return { data: mockedResponse, error: null };
    }

    const api = new ChatGPTAPI({
      apiKey,
      completionParams: {
        model,
      },
    });

    const res = await api.sendMessage(prompt, {
      onProgress,
    });

    return { data: res.text, error: null };
  } catch (error) {
    const errorResponse = error as ChatGPTError;
    console.error(errorResponse);
    return { data: null, error: errorResponse.message };
  }
};

export const getClaudeResponse = async (
  apiKey: string,
  prompt: string,
  model: string = 'claude-3-5-sonnet-latest',
) => {
  try {
    if (import.meta.env.MODE === 'development') {
      console.warn('Using mocked response for Claude');
      // Mocked response for local development
      const mockedResponse = `Mocked Claude response for prompt: "${prompt}" using model: "${model}"`;
      return { data: mockedResponse, error: null };
    }

    const api = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    const res = await api.messages.create({
      max_tokens: 1024,
      messages: [{ content: prompt, role: 'user' }],
      model,
    });

    return { data: (res.content[0] as TextBlock).text, error: null };
  } catch (error) {
    const { error: errorResponse } = error as {
      error: Anthropic.ErrorResponse;
    };
    console.error(errorResponse);
    return { data: null, error: errorResponse.error.message };
  }
};
