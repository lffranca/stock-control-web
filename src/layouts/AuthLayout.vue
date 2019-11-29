<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="background window-height">
        <div class="title-all">
          <div
            class="title-app"
          >
            Stock Control
          </div>
          <div
            class="subtitle-app"
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem quaerat beatae eaque qui quasi ab quia excepturi labore voluptatum iure, quis at nisi minus. Mollitia corrupti optio eveniet commodi molestiae!
          </div>
        </div>
      </div>
      <div class="content-login">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
  .background {
    background-image: url("~assets/bg_login.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;

    .title-all {
      color: white;
      margin-left: 100px;
      max-width: 700px;

      .title-app {
        font-size: 30px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 40px;
      }

      .subtitle-app {
        font-size: 20px;
      }
    }
  }

  .content-login {
    position: fixed;
    height: 100%;
    width: 100%;
    max-width: 500px;
    background-color: white;
    top: 0;
    right: 0;
  }
</style>

<script>
export default {
  name: 'AUTH',

  data () {
    return {}
  }
}
</script>
