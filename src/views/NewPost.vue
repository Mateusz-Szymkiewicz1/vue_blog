<script setup>
  import {ref} from 'vue'
  import { useRouter } from 'vue-router'
  import Editor from 'primevue/editor';
  const router = useRouter()
  const user = ref("")
  fetch("http://localhost:3000/logowanie", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(res => {
      if(res.text){
        router.replace("/")
      }else{
        user.value = res
      }
  })

  const tytul = ref("")
  const tekst = ref("")
  const preview = ref(false)
  const error = ref("")
  document.documentElement.style.setProperty("--p-editor-toolbar-item-active-color", "#6d28d9");
  
  const toggle_preview = () => {
    if(!tekst.value || !tytul.value){
      error.value = "Wpisz tytuł/treść!"
      return
    }
    document.querySelector('.preview div').innerHTML = tekst.value
    document.querySelector('.preview h2 span').innerText = tytul.value
    if(preview.value){
      document.querySelector('body').style = ''
    }else{
      error.value = ""
      document.querySelector('body').style = 'overflow: hidden;'
      console.log(tekst.value)
    }
    preview.value = !preview.value
  }

  const data = ref("")
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  data.value = yyyy + '-' + mm + '-' + dd 
</script>

<template>
  <div v-if="user" class="px-8 md:px-16 mb-16">
    <h1 class="text-center font-semibold text-gray-900 mb-10 text-4xl mt-16 dark:text-slate-200">Nowy post</h1>
    <input v-model="tytul" type='text' maxlength="200" placeholder='Tytuł' class="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200" />
    <Editor v-model="tekst" class="mt-5" editorStyle="height: 320px">
      <template v-slot:toolbar>
        <span class="ql-formats">
          <select class="ql-size">
              <option value="small">Small</option>
              <option selected></option>
              <option value="large">Large</option>
              <option value="huge">Huge</option>
            </select>
        </span>
        <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
            <button class="ql-list" value="ordered"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-code-block"></button>
          <button class="ql-blockquote"></button>
        </span>
    </template>
      </Editor>
      <div @click="toggle_preview" class="rounded-md my-5 cursor-pointer text-white bg-violet-600 float-left p-3">Podgląd</div>
  </div>

  <div class="preview max-h-full overflow-y-scroll px-6 lg:px-8 fixed top-0 left-0 right-0 min-h-full bg-white dark:bg-neutral-950 !pr-36" :class="preview ? 'block' : 'hidden'">
    <h1 class="text-center font-semibold text-gray-900 text-4xl mt-16 dark:text-slate-200">Podgląd</h1>
    <h2 class="flex break-all flex-wrap gap-3 font-semibold text-gray-900 text-5xl my-10 mt-16 dark:text-slate-200">
      <span></span>
      <span class="text-lg dark:text-slate-400 font-normal mt-6 text-slate-600">{{ data }}</span>
    </h2>
    <div class="break-words text-lg text-gray-700 dark:text-slate-400"></div>
    <i @click="toggle_preview" class="fa fa-close text-4xl absolute top-5 right-7 cursor-pointer"></i>
  </div>

  <div class="fixed bottom-4 z-50 right-4 min-w-64" v-if="error">
    <div class="dark:bg-rose-950 flex justify-between bg-red-500 rounded-lg shadow-lg border border-red-600 dark:border-rose-900 p-4">
        <p class="text-white text-lg mr-5 dark:text-slate-200">
          {{ error }}
        </p>
        <button @click="error = ''" class="text-white dark:text-slate-200 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
  </div>
</template>

<style>
  .preview .ql-size-small{
    @apply text-sm;
  }
  .preview .ql-size-large{
    @apply text-3xl;
  }
  .preview .ql-size-huge{
    @apply text-4xl;
  }
  .preview ol{
    list-style: decimal;
    @apply ml-10;
  }
  .preview a{
    @apply text-violet-600 underline;
  }
  .preview blockquote{
    @apply p-4 my-4 border-s-4 border-violet-600 bg-neutral-100 dark:bg-neutral-800
  }
</style>