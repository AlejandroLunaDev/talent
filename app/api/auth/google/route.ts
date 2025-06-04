import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    // Obtener la URL de callback del origen de la solicitud
    const origin = request.headers.get('origin') || request.headers.get('host');
    const callbackUrl = `${origin}/callback`;

    console.log('Iniciando login con Google, callback:', callbackUrl);

    // Enviar solicitud al backend
    const response = await fetch(`${BACKEND_URL}/api/talents/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ callbackUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error iniciando sesión con Google');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en login con Google:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Error iniciando sesión con Google'
      },
      { status: 500 }
    );
  }
} 