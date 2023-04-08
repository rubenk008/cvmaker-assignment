import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  width: 500px;
  height: 20px;
  position: fixed;
  top: -30px;
  left: 0;
  background: white;
  color: black;
  display: block;

  &.debug {
    top: 0;
    left: 0;
  }
`;

// eslint-disable-next-line react/display-name
const HiddenInput = React.forwardRef(
  (
    { value, onChange, debug, ...rest }: HiddenInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <StyledInput
        ref={ref}
        value={value}
        onChange={onChange}
        className={debug ? "debug" : ""}
        {...rest}
      />
    );
  }
);

export default HiddenInput;
