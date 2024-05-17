export interface CodeProps {
  children?: string;
}

export const Code = (props: CodeProps) => {
  const { children } = props;

  if (!children) {
    return null;
  }

  return (
    <pre className="bg-slate-800 text-slate-400 p-4 rounded overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
};
