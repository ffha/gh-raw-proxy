import useReflare from 'reflare';
import mime from 'mime-types';

async function handleRequest(request) {
    const reflare = await useReflare();
    reflare.push({
        path: '/*',
        upstream: {
            domain: 'raw.githubusercontent.com',
            protocol: 'https',
            onRequest: (request) => {
                request.headers.set('Accept-Encoding', '')
                return request;
            },
            onResponse: (response, url) => {
                response.headers.delete('content-security-policy');
                response.headers.delete('via');
                response.headers.delete('x-cache');
                response.headers.delete('vary');
                response.headers.delete('x-cache-hits');
                response.headers.delete('x-served-by');
                response.headers.delete('x-timer');
                response.headers.delete('x-xss-protection');
                response.headers.delete('x-github-request-id');
                response.headers.delete('x-frame-options');
                response.headers.delete('source-age');
                response.headers.delete('x-fastly-request-id');
                const contentType = mime.contentType(mime.lookup(new URL(url).pathname));
                response.headers.set('Content-Type', contentType);
                response.headers.set('Cache-Control', 'public, max-age=31536000');
                return response;
            }
        }
    });
    return reflare.handle(request);
}

addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});
