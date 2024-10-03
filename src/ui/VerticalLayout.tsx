import tokens from "open-props";
import styled from "styled-components";

export default styled.div`
  align-items: stretch;
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  gap: ${tokens.size5};
  padding-top: ${tokens.size10};

  @media (max-width: 500px) {
    padding-top: ${tokens.size3};
  }
`;
