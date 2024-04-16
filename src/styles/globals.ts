import { createGlobalStyle } from 'styled-components';
export const GlobalStyle = createGlobalStyle`
html,body{
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
}
#__next{
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: scroll;
    background-color: #222222;
}
*{
    box-sizing: border-box;
    font-size: 24px;
    color: #222222;
    transition-duration: 300ms;
    transition-timing-function: ease-in-out;
}
`;
