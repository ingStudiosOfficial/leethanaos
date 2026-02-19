<script setup lang="ts">
</script>

<template>
    <div class="app-wrapper">
        <h2 class="header">About Me</h2>
        <ul>
            <li>Name: Ethan Lee</li>
            <li>Gender: Male</li>
            <li>Pronouns: he/him/turtle/dev</li>
            <li>Hobbies: Programming, video editing, YouTube content creator</li>
        </ul>
        <p>Hi. I'm Ethan, a <span class="highlight">full-stack web developer</span> who makes (weird) stuff. I personally like the <span class="highlight">Material 3</span> design system, so you'll probably see that most of my projects look similar to each other.</p>
        <p>Regarding my skills, I mainly do <span class="highlight">web development</span>, but sometimes I do make other stuff. Other stuff include <span class="highlight">Chrome Extensions</span>, <span class="highlight">CLI tools</span>, and <span class="highlight">mobile apps</span>. Do check the 'Tech Stack' applet to learn more.</p>
        <p>Some of my favourite projects I made include <span class="highlight">Cordfriend AI</span>, <span class="highlight">Calculite</span>, and <span class="highlight">Examduler</span>. Find out more in the 'Projects' applet.</p>
        <p>For now, have fun exploring the operating system I guess. See ya!</p>
    </div>
</template>

<style scoped>
.app-wrapper {
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100%;
}

.header {
    color: var(--md-sys-color-primary);
}

.highlight {
    color: var(--md-sys-color-secondary);
}
</style>