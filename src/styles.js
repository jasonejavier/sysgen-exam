import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, #root, body {    
        height: auto;
        min-height: calc(100vh - 20px);
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 10px;
    }

    .body-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: calc(100vh - 20px);
    }

    .nav-header {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: #fff;

        .nav-title {
            flex: 1;

            h1 {
                margin: 0;
            }
        }

        .nav-controls {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .hidden {
        display: none;
    }

    .less-opacity {
        opacity: 0.4;
    }

    .gallery {
        display: flex;
        flex: 1;
        padding-left: 5px;
        padding-right: 5px;
        justify-content: flex-start;

        .no-photos {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .gallery-row {
            flex-wrap: wrap;
            justify-content: flex-start;
            
            max-width: calc(5 * 16rem);
            min-width: 25em;
            margin: 0 auto;
        }

        .image-tile-card {
            display: flex;
            flex-direction: column;
            flex: auto;
            position: relative;
            margin: 10px;
            width: 210px;
            cursor: pointer;
            transition: 0.3s opacity;

            .image-tile-checkbox {
                position: absolute;
                left: 10px;
                top: 5px;
            }

            .image-tile-wrapper {
                background-color: #ececec;
                border-radius: 3px;
            }

            img {
                display: flex;
                flex: auto;
                width: 100%;
                object-fit: scale-down;
                height: 150px;
                border-radius: 3px;
            }
        }

        .image-tile-details {
            margin-top: 10px;
            text-align: center;

            .tile-name {
                font-weight: 500;
                margin-bottom: 0;
            }

            .tile-album {
                font-size: 0.9em;
                margin-bottom: 0;
            }
        }

        .load-more-btn {
            margin: 10px;
        }

        .end-msg {
            margin: 50px 10px;
            font-weight: 500;
            text-align: center;
        }
        
    }
    
`;

export default GlobalStyle;
