import React from "react";
import styled from "styled-components";

import FieldCell from "../FieldCell/FieldCell";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const PlayingField = ({
  rows,
  columns,
  values,
  onClick,
}: PlayingFieldProps) => {
  return (
    <Container onClick={onClick}>
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <Row key={rowIndex}>
            {Array(columns)
              .fill(0)
              .map((_, columnIndex) => {
                const value = values[rowIndex]?.[columnIndex]?.value;
                const state = values[rowIndex]?.[columnIndex]?.state;
                return (
                  <FieldCell key={columnIndex} value={value} state={state} />
                );
              })}
          </Row>
        ))}
    </Container>
  );
};

export default PlayingField;
