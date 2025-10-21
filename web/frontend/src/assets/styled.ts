import { tokens, Text } from "@fluentui/react-components"
import styled from "styled-components"
import img from "./background.jpg"
export const AppBody = styled.div`
    background-image: url(${img});
    height: 100vh;
    max-height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: "Lato", sans-serif;
`

export const BackgroundGlass = styled.div`
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(7.3px);
    border: 1px solid rgba(0, 0, 0, 0.5);
`

export const PageWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${tokens.colorNeutralBackground1};
    padding: 10px;
    box-sizing: border-box;
    max-height: calc(100vh - 20px);
    overflow-y: auto;
`

export const TextGreen = styled(Text)`
    color: #68c865;
    font-weight: 700;
`

export const LinkColor = styled(Text)`
    color: ${tokens.colorStatusDangerForeground1};
    cursor: pointer;
`

export const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
`

export const Thead = styled.thead`
    background-color: ${tokens.colorNeutralBackground2};
    &>tr>td{
        padding: 8px 6px;
    }
`

export const Tbody = styled.tbody`

`

