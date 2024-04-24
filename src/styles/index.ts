import styled from 'styled-components';

export const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  .canvas-container {
    @media (min-width: 560px) {
      transform: scale(1.5);
    }
  }
`;
