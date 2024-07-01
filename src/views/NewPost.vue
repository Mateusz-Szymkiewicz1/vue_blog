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
  document.documentElement.style.setProperty("--p-editor-toolbar-item-active-color", "#6d28d9");
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
  </div>
</template>