import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client?: OpenAI;

  constructor(private config: ConfigService) {
    const key = this.config.get<string>('OPENAI_API_KEY');
    if (key) this.client = new OpenAI({ apiKey: key });
  }

  async generateLeadSummary(input: Record<string, unknown>) {
    return this.generateText('Generate a factual lead summary.', input);
  }

  async generateFirstMessage(input: Record<string, unknown>) {
    return this.generateText(
      'Write a professional but friendly first outreach message. Include proposition: I help local businesses get more clients with websites and automation.',
      input
    );
  }

  async generateFollowUp(input: Record<string, unknown>) {
    return this.generateText('Write a concise follow-up message.', input);
  }

  async generateText(instruction: string, input: Record<string, unknown>) {
    const payload = JSON.stringify(input);
    if (!this.client) {
      return `${instruction}\nContext: ${payload}`;
    }

    const completion = await this.client.responses.create({
      model: 'gpt-4o-mini',
      input: `${instruction}\nUse only this known data: ${payload}`
    });

    return completion.output_text;
  }
}
