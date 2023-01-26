import clsx from 'clsx';

// Utility for checking membership of an array, and narrowing the type
function includes<S extends string>(
  haystack: readonly S[],
  needle: string
): needle is S {
  return (haystack as readonly string[]).includes(needle);
}

interface TitleProps {
  children: React.ReactNode;
  type: string;
  css?: string;
}

export const Title: React.FC<TitleProps> = ({ children, type, css }) => {
  const classes: any = {
    h1: 'text-4xl md:text-5xl font-title mt-6 mb-2',
    h2: 'text-3xl md:text-4xl font-sans mt-4 mb-2 text-slate-600',
    h3: 'text-2xl font-title mt-4 mb-2 p-2',
    h4: 'text-2xl font-sans mt-3',
    h5: 'text-xl font-sans mt-3',
    h6: 'text-lg font-sans mt-3',
  };

  const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
  const safeHeading = type ? type.toLowerCase() : '';
  const Heading = includes(headingLevels, safeHeading) ? safeHeading : 'p';

  return (
    <div className={clsx(classes[safeHeading], css ? css : '')}>
      <Heading>{children}</Heading>
    </div>
  );
};
