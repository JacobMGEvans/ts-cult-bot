import clsx from 'clsx';
import { typeToFlattenedError } from 'zod';

// Utility for checking membership of an array, and narrowing the type
function includes<S extends string>(
  haystack: readonly S[],
  needle: string
): needle is S {
  return (haystack as readonly string[]).includes(needle);
}

const types = {
  h1: 'text-4xl md:text-5xl font-title mt-6 mb-2',
  h2: 'text-3xl md:text-4xl font-title mt-4 mb-2 text-slate-600',
  h3: 'text-2xl font-title mt-4 mb-2 p-2',
  h4: 'text-2xl font-sans mt-3',
  h5: 'text-xl font-sans mt-3',
  h6: 'text-lg font-sans mt-3',
};

const variants = {
  default: 'font-normal',
  bold: 'font-bold',
};

interface TitleProps {
  children: React.ReactNode;
  type: keyof typeof types;
  variant?: keyof typeof variants;
  css?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  type,
  variant = 'default',
  css,
}) => {
  const Type = type as keyof JSX.IntrinsicElements;

  return (
    <div
      className={clsx(
        types[type],
        variants && variants[variant],
        css ? css : ''
      )}
    >
      <Type>{children}</Type>
    </div>
  );
};
