import styled from 'styled-components';

export const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-width: 380px;

  .canvas-container {
    @media (min-width: 560px) {
      transform: scale(1.5);
    }
  }
`;
