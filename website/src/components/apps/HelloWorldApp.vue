<script setup lang="ts">
</script>

<template>
    <div class="app-wrapper">
        <h2>general_info (and random stuff)</h2>
        <p>Hello, World! This is my first window in my web 'operating system'. Pretty cool right?</p>
        <p>Check out this sick font. It's Google Sans Code.</p>
        <p>Oh yeah and by the way, this 'operating system' is made in Vue.js. You gotta love Vue.</p>
        <p>And no ts ain't vibe coded...</p>
        <h2>about_system</h2>
        <ul>
            <li>Framework: Vue.js</li>
            <li>Design style: Material 3</li>
        </ul>
        <h2>help</h2>
        <p>Uhh try typing 'help' in the terminal I guess...</p>
    </div>
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100%;
}

.app-wrapper * {
    font-family: 'Google Sans Code';
}
</style>