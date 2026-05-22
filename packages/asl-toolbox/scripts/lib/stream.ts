export function fromAsyncIterable<T>(source: AsyncIterable<T>): ReadableStream<T> {
  return new ReadableStream(
    {
      async start(controller) {
        for await (const t of source) {
          controller.enqueue(t);
        }
        controller.close();
      }
    }
  );
}

export function filter<T>(predicate: (t: T) => boolean): TransformStream<T, T> {
  return new TransformStream(
    {
      transform(t, controller) {
        if (predicate(t)) {
          controller.enqueue(t)
        }
      }
    }
  );
}

export function map<In, Out>(mapper: (i: In) => Out | Promise<Out>): TransformStream<In, Out> {
  return new TransformStream(
    {
      async transform(t, controller) {
        controller.enqueue(await mapper(t))
      }
    }
  );
}

export function forEach<In>(peeker: (i: In) => void | Promise<void>): TransformStream<In, In> {
  return new TransformStream(
    {
      async transform(item: In, controller) {
        await peeker(item);
        controller.enqueue(item);
      }
    }
  );
}

export function flatMap<In, Out>(mapper: (i: In) => Out[] | Promise<Out[]>): TransformStream<In, Out> {
  return new TransformStream(
    {
      async transform(i, controller) {
        (await mapper(i)).forEach(out => controller.enqueue(out))
      }
    }
  );
}

export function toCSV(): TransformStream<Record<string, unknown>, Uint8Array> {
  const encoder = new TextEncoder();

  let headersSent = false;
  const escapeCell = (cell: unknown): string => {
    const asString = String(cell);
    return /["\n\r,]/.test(asString)
      ? `"${asString.replace(/"/g, '""')}"`
      : asString;
  }

  return new TransformStream(
    {
      transform(obj, controller) {
        if (!headersSent) {
          const headerRow = [...Object.keys(obj)].map(escapeCell).join(",");
          controller.enqueue(encoder.encode(`${headerRow}\n`));
          headersSent = true;
        }

        const valuesRow = [...Object.values(obj)].map(escapeCell).join(",");
        controller.enqueue(encoder.encode(`${valuesRow}\n`));
      }
    }
  )
}
