<template>
  <div id="app">
    <router-view/>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700|Noto+Serif+JP:400,500,600,700&subset=japanese');

  @font-face {
    font-family: "Noto Sans JP", "Noto Serif JP", "YuMincho";
    src: url('https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700|Noto+Serif+JP:400,500,600,700|YuMincho&subset=japanese');
  }
  html, body {
    font-family: 'Noto Sans JP', "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro",メイリオ,Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    margin: 0;
  }
  input, textarea {
    text-indent: 0.5em;
    width: 100%;
    font-family: SourceHanSansJP;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: 1px;
    text-align: left;
    color: #190704;
  }
  a {
    color: whitesmoke;
    text-decoration: none;
  }
  .card-body {
    margin: 0;
    padding: 0;
  }

  .headline-text {
    font-family: 'Noto Serif JP',游明朝,"Yu Mincho",YuMincho,"Hiragino Mincho ProN",HGS明朝E,serif;
  }
  .normal-text {
    font-family: SourceHanSansJP,self;
  }

  .form-group-element {
    display: flex;
    flex-direction: column;
  }
  .form-element {
    padding: 2vh 0vw 2vh 0vw;
  }
  .form-element-btn {
    position: relative;
    margin-left: auto;
    width: 10vw;
  }

  #app {
    margin: 0;
    width: 100vw;
  }
  #container {
    position: relative;
    height: 100vh;
  }
  .col-content {
    position: relative;
    top: 3vh;
    display: flex;
    flex-direction: column;
    padding: 0vh 3vw 0vh 3vw;
    width: 100%;
  }
  .row-content {
    position: relative;
    top: 8vh;
    display: flex;
    flex-direction: row;
  }
  .base-content {
    padding: 2vh 10vw 2vh 10vw;
    width: 80vw;
  }
  .arrow-down {
    text-align: center;
    padding: 1vh 0vw 0vh 0vw;
    margin: 1vh 0vw 0vh 0vw;
    border: solid lightskyblue 1px;
  }
  .arrow-down:hover {
    border: solid #409EFF 2px;
    border-radius: 3px;
  }
  .btn-submission {
    position: relative;
    width: 10vw;
    margin: 0 0 0 auto;
  }
  .modal-backdrop {
    opacity: 0.5;
  }
  .header {
    font-size: 0.8rem;
    margin-bottom: 5px;
  }
  .logs {
    min-height: 50px;
    border: 1px solid #ddd;
  }
  table.table.b-table > thead > tr,
  table.table.b-table > tbody > tr {
    cursor: pointer;
  }
  table.table.b-table > thead > tr > th[aria-sort="ascending"]::after,
  table.table.b-table > tfoot > tr > th[aria-sort="ascending"]::after {
    opacity: 1;
    content: "\2191"; // up arrow
  }
  table.table.b-table > thead > tr > th[aria-sort="descending"]::after,
  table.table.b-table > tfoot > tr > th[aria-sort="descending"]::after {
    opacity: 1;
    content: "\2193"; // down arrow
  }
  table.table.b-table > tbody > tr:hover {
    background: #dee2e6;
  }
</style>
