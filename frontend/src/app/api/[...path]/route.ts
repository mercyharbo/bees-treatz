import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_BASE_URL = process.env.API_URL || 'https://bees-treatz.onrender.com/api';

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    const resolvedParams = await context.params;
    const subpath = resolvedParams?.path ? resolvedParams.path.join('/') : '';
    const searchParams = request.nextUrl.search;
    const targetUrl = `${BACKEND_BASE_URL.replace(/\/$/, '')}/${subpath}${searchParams}`;

    // Forward safe request headers
    const forwardedHeaders = new Headers();
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Filter out hop-by-hop headers and host
      if (
        ![
          'host',
          'connection',
          'keep-alive',
          'transfer-encoding',
          'content-length',
        ].includes(lowerKey)
      ) {
        forwardedHeaders.set(key, value);
      }
    });

    // Auto-inject Authorization header from bt_auth_token cookie if client omitted it
    if (!forwardedHeaders.has('authorization')) {
      const cookieToken = request.cookies.get('bt_auth_token')?.value;
      if (cookieToken) {
        forwardedHeaders.set('authorization', `Bearer ${cookieToken}`);
      }
    }

    const hasBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    let body: BodyInit | undefined = undefined;

    if (hasBody) {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const text = await request.text();
        if (text) body = text;
      } else if (contentType.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        const text = await request.text();
        if (text) body = text;
      }
    }

    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardedHeaders,
      body,
      cache: 'no-store',
    });

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        ![
          'transfer-encoding',
          'connection',
          'keep-alive',
          'content-encoding',
          'content-length',
        ].includes(lowerKey)
      ) {
        responseHeaders.set(key, value);
      }
    });

    const responseContentType = backendResponse.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      try {
        const data = await backendResponse.json();
        return NextResponse.json(data, {
          status: backendResponse.status,
          headers: responseHeaders,
        });
      } catch {
        // Fall back to text if json parsing fails
      }
    }

    const textData = await backendResponse.text();
    return new NextResponse(textData, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Backend connection error';
    return NextResponse.json(
      {
        error: errorMessage,
        message: 'Failed to communicate with backend server',
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
