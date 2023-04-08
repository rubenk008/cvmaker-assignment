interface HiddenInputProps extends React.HTMLAttributes<HTMLInputElement> {
  debug?: boolean;
  value?: string;
  ref?: React.RefObject<HTMLInputElement>;
}
