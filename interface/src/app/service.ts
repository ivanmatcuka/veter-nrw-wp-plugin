import Anthropic from '@anthropic-ai/sdk';
import { TextBlock } from '@anthropic-ai/sdk/resources/index.mjs';
import { ChatGPTAPI, ChatGPTError, ChatMessage } from 'chatgpt';

const API_URL = import.meta.env.VITE_WORDPRESS_URL;

export type SettingsResponse = {
  id: number;
  default_model: string;
  api_chat_gpt: string;
  api_claude: string;
  morning_text_header: string;
  morning_text_before: string;
  morning_text_block_header: string;
  morning_text_after: string;
  evening_text_header: string;
  evening_text_before: string;
  evening_text_block_header: string;
  evening_text_after: string;
  created_at: string;
  updated_at: string;
  news_prompt: string;
  news_header_prompt: string;
  morning_prompt: string;
  evening_prompt: string;
  weather_prompt: string;
  tones: string;

  // TODO: check
  [key: string]: unknown;
};

export const getSettings = async (): Promise<SettingsResponse | null> => {
  try {
    const response = await fetch(
      `${API_URL}/wp-json/veter-nrw-plugin/v1/settings`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

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
  try {
    const response = await fetch(
      `${API_URL}/wp-json/veter-nrw-plugin/v1/create-news-draft`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      },
    );

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
  try {
    const response = await fetch(
      `${API_URL}/wp-json/veter-nrw-plugin/v1/create-daytime-draft`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      },
    );

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
  onProgress?: ((partialResponse: ChatMessage) => void) | undefined,
) => {
  try {
    const api = new ChatGPTAPI({
      apiKey,
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

export const getClaudeResponse = async (apiKey: string, prompt: string) => {
  try {
    const api = new Anthropic({
      dangerouslyAllowBrowser: true,
      apiKey,
    });

    const res = await api.messages.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
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
