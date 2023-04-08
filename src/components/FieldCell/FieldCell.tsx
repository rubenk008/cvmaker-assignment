import React from "react";
import styled from "styled-components";
import { variant } from "styled-system";

const Container = styled("div")<FieldCellState>(
  {
    width: "60px",
    height: "60px",
    border: "1px solid var(--color-gray)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
  },
  variant({
    variants: {
      default: {
        borderColor: "var(--color-gray)",
      },
      incorrect: {
        borderColor: "var(--color-gray)",
      },
      correct: {
        backgroundColor: "var(--color-green)",
        borderColor: "var(--color-green)",
      },
      partiallyCorrect: {
        backgroundColor: "var(--color-mustard-yellow)",
        borderColor: "var(--color-green)",
      },
    },
  })
);

const Value = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--color-white);
  font-family: "Inter", sans-serif;
`;

const FieldCell = ({ value, state }: FieldCellProps) => {
  return (
    <Container variant={state}>
      <Value>{value}</Value>
    </Container>
  );
};

export default FieldCell;
