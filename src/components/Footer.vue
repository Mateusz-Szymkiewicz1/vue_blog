<script setup>
  const year = new Date().getFullYear()
</script>

<template>
   <footer class="bg-violet-400 mt-auto">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
            <router-link to="/">
            <div class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src="../assets/logo.png" class="h-8"/>
                <span class="self-center font-semibold text-xl whitespace-nowrap text-gray-50">Mateusz Szymkiewicz</span>
            </div></router-link>
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-50 sm:mb-0">
                <li>
                    <router-link to="/about" class="hover:underline me-4 md:me-6">O mnie</router-link>
                </li>
                <li>
                    <a href="https://github.com/Mateusz-Szymkiewicz1" target="_blank" class="hover:underline me-4 md:me-6">Github</a>
                </li>
                <li>
                    <router-link to="/kontakt" class="hover:underline">Kontakt</router-link>
                </li>
            </ul>
        </div>
        <hr class="my-6 sm:mx-auto border-gray-200 lg:my-8" />
        <span class="block text-sm text-gray-50 sm:text-center">© {{ year }} <a href="https://github.com/Mateusz-Szymkiewicz1" target="blank" class="hover:underline">Mateusz Szymkiewicz</a>. All Rights Reserved.</span>
    </div>
</footer>
</template>