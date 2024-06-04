<template>
  <h1 class="sm:text-4xl text-3xl font-semibold text-center mb-10 mt-20">Logowanie</h1>
  <form class="mx-auto space-y-4 px-5">
      <input type='text' placeholder='Login' class="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-[#007bff]" />
      <input type='password' placeholder='Hasło' class="w-full rounded-md py-3 px-4 bg-gray-100 text-sm outline-[#007bff" />
      <button @click.prevent class="text-white bg-violet-400 hover:bg-violet-500 font-semibold rounded-md text-sm px-4 py-3 w-full">Zaloguj</button>
  </form>
</template>