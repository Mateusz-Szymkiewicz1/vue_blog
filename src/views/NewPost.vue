<script setup>
  import {ref} from 'vue'
  import { useRouter } from 'vue-router'
  import Editor from 'primevue/editor';
  import FileUpload from 'primevue/fileupload';
  import Multiselect from '@vueform/multiselect'
  import { decision } from '../composables/Decision.vue'
  import Toast from '../components/Toast.vue'
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
  const thumbnail = ref()
  const tags = ref([])
  const selected_tags = ref([])
  const tekst = ref("")
  const preview = ref(false)
  const toast = ref({})
  document.documentElement.style.setProperty("--p-editor-toolbar-item-active-color", "#6d28d9");
  
  fetch('http://localhost:3000/posty').then(res => res.json()).then(res => {
        if(res.status == 0){
            toast.value = {type:"error",msg:res.text}
        }else{
            res.forEach(el => {
                if(el.tagi){
                    el.tagi = JSON.parse(el.tagi)
                    el.tagi.forEach(tag => {
                        if(!tags.value.includes(tag)){
                            tags.value.push(tag)
                        }
                    })
                }
            })
        }
    })

  const toggle_preview = () => {
    document.querySelector('.preview img').src = ""
    if(!tekst.value || !tytul.value){
      toast.value = {type:"error",msg:"Wpisz tytuł/treść!"}
      return
    }
    document.querySelector('.preview div').innerHTML = tekst.value
    document.querySelector('.preview h2 span').innerText = tytul.value
    if(thumbnail.value.files[0]){
      document.querySelector('.preview img').src = thumbnail.value.files[0].objectURL
    }
    if(preview.value){
      document.querySelector('body').style = ''
    }else{
      toast.value = {}
      document.querySelector('body').style = 'overflow: hidden;'
    }
    preview.value = !preview.value
  }

  const dodaj_post = async () => {
    if(!tekst.value || !tytul.value){
      toast.value = {type:"error",msg:"Wpisz tytuł/treść!"}
      return
    }
    if (document.querySelector(".decision")) document.querySelector('.decision').remove()
    const response = await decision().then(function () {
        document.querySelector(".decision").remove()
        return
    }, function () {
        document.querySelector(".decision").remove()
        return "stop"
    });
    if(response) return
    const formData  = new FormData();
    formData.append('tytul', tytul.value);
    formData.append('tekst', tekst.value);
    formData.append('tagi', selected_tags.value);
    formData.append('img', thumbnail.value.files[0]);
    fetch("http://localhost:3000/dodajpost", {
      credentials: 'include',
      method: "POST",
      body: formData
    }).then(router.push('/dashboard'))
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
    <input v-model="tytul" type='text' maxlength="200" placeholder='Tytuł' class="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200 mb-5" />
    <FileUpload :invalidFileTypeMessage="'Wybrano zły format pliku!'" :chooseLabel="'Dodaj miniaturkę'" :cancelLabel="'Anuluj'" ref="thumbnail" name="thumbnail[]" accept="image/*" :showUploadButton="false" :fileLimit="1">
      <template #empty>
          <span>Przeciągnij tu plik aby dodać.</span>
      </template>
  </FileUpload>
  <Multiselect :searchable="true" :createOption="true" class="mt-5 !p-0 !text-sm !text-gray-400 !h-[38px] dark:bg-indigo-950 bg-violet-100 rounded-lg border dark:border-indigo-950 border-gray-300" :max="5" :limit="10" mode="tags" placeholder="Tags" v-model="selected_tags" :options="tags">
       <template v-slot:option="{ option }">
         <span class="p-1 w-full px-2 font-normal dark:bg-indigo-950 bg-violet-50 dark:text-slate-200 text-gray-700 hover:bg-violet-100 dark:hover:bg-indigo-900">{{ option.value }}</span>
       </template>
    </Multiselect>
    <Editor v-model="tekst" class="mt-20" editorStyle="height: 320px">
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
      <div @click="toggle_preview" class="rounded-md my-5 px-6 cursor-pointer text-white bg-violet-600 float-left p-3">Podgląd</div>
      <div @click="dodaj_post" class="rounded-md my-5 ml-2 px-6 cursor-pointer text-white bg-violet-600 float-left p-3">Dodaj</div>
  </div>

  <div class="preview z-50 max-h-full overflow-y-scroll px-6 lg:px-8 fixed top-0 left-0 right-0 min-h-full bg-white dark:bg-neutral-950" :class="preview ? 'block' : 'hidden'">
    <h1 class="text-center font-semibold text-gray-900 text-4xl mt-16 dark:text-slate-200">Podgląd</h1>
    <h2 class="font-semibold text-gray-900 text-5xl my-10 mt-16 dark:text-slate-200">
      <span></span>
      <span class="text-lg ml-2 dark:text-slate-400 font-normal mt-6 text-slate-600">{{ data }}</span>
      <span v-for="tag in selected_tags" class="rounded-md dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2">{{ tag }}</span>
    </h2>
    <img>
    <div class="break-words md:pr-36 text-lg text-gray-700 dark:text-slate-400"></div>
    <i @click="toggle_preview" class="fa fa-close text-4xl absolute top-5 right-7 cursor-pointer"></i>
  </div>

  <Toast :toast="toast" @closeToast="toast = {}"></Toast>
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
  .p-fileupload-file-badge{
    display: none !important;
  }
  .p-fileupload-choose-button{
    @apply !bg-violet-600 !border-violet-700 !text-white;
  }
  .dark .multiselect-dropdown{
      background: #2f2c5c;
      border: 1px solid #3f3d6d;
  }
</style>