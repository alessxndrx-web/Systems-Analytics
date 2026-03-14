<<<<<<< ours
﻿'use client';

=======
'use client';
>>>>>>> theirs
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
<<<<<<< ours
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 30_000
          }
        }
      })
  );

=======
  const [client] = useState(() => new QueryClient());
>>>>>>> theirs
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
