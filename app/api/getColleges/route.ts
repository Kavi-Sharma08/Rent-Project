// app/api/getColleges/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

const token = process.env.AZURE_OPENAI_KEY!;
const endpoint = 'https://models.github.ai/inference';
const model = 'xai/grok-3';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    console.log(query)
    if (!token) {
      console.error('❌ GITHUB_TOKEN is missing');
      return NextResponse.json({ error: 'Token not set' }, { status: 500 });
    }

    const client = ModelClient(endpoint, new AzureKeyCredential(token));
    console.log(client)

    const response = await client.path('/chat/completions').post({
      body: {
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Return a list of colleges in plain text and do not give extra information like Here are some of the colleges.' },
          { role: 'user', content: `Suggest colleges based on input: ${query}` },
        ],
        temperature: 0.7,
        top_p: 1,
        model,
      },
    });
    console.log(response.body)

    if (isUnexpected(response)) {
      console.error('❌ Unexpected model response:', response.body.error);
      return NextResponse.json({ error: 'Model API error' }, { status: 500 });
    }

    const message = response.body.choices[0].message.content || '';
    const suggestions = message
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').trim()) // remove number list like "1. Harvard"
      .filter(Boolean);
    console.log(suggestions)  
    

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 });
  }
}
