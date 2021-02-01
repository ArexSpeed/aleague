import styled from 'styled-components';
import { keyframes } from 'styled-components'

const animate = keyframes`
  from {
   width: 0;
  }
  to {
   width: ${props => props.width}%;
  }
`;

export const Percent = styled.div`
  position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.width}%;
    background: #a2fa92;
    animation: 2s ${animate};
`