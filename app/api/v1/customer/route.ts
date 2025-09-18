// app/api/v1/customer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Mocked user data (you can also import this from a file)
const mockUser = {
    firstName: 'Juan',
    lastName: 'Pérez',
    role: 'Developer',
    projects: ['Integración con Salesforce', 'Migración a Snap']
};

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Load markdown documentation from local file
        const docPath = path.resolve(process.cwd(), 'data', 'snap-doc.md');
        const snapDoc = fs.readFileSync(docPath, 'utf8');

        // Create the system prompt
        const userInfo = `Usuario: ${mockUser.firstName} ${mockUser.lastName}, Rol: ${mockUser.role}, Proyectos: ${mockUser.projects.join(', ')}`;
        const systemPrompt = `
Eres un asistente experto en Snap. Usa la siguiente documentación de referencia y la información del usuario para responder su consulta de forma precisa y útil.

Documentación de Snap:
${snapDoc}

Información del usuario:
${userInfo}
    `;

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
            ],
        });

        const aiResponse = completion.choices[0].message.content;

        return NextResponse.json({ response: aiResponse });
    } catch (error: any) {
        console.error('[OPENAI ERROR]', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
