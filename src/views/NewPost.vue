<script setup>
  import {ref} from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import Editor from 'primevue/editor';
  Editor.methods.renderValue = function renderValue(value) {
  if (this.quill) {
    if (value) {
      const delta = this.quill.clipboard.convert({ html: value });
      this.quill.setContents(delta, 'silent');
    } else {
      this.quill.setText('');
    }
  }
};
  import FileUpload from 'primevue/fileupload';
  import Multiselect from '@vueform/multiselect'
  import { decision } from '../composables/Decision.vue'
  const emit = defineEmits(['toast'])
  const router = useRouter()
  const route = useRoute()
  const post_edit = ref()
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
  document.documentElement.style.setProperty("--p-editor-toolbar-item-active-color", "#6d28d9");
  
  fetch('http://localhost:3000/posty').then(res => res.json()).then(res => {
        if(res.status == 0){
            emit('toast', {type:"error",msg:res.text})
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


  if(route.params.id){
    fetch('http://localhost:3000/post/'+route.params.id).then(res => res.json()).then(res => {
      if(res.status == 0){
        router.go("/")
      }else{
            post_edit.value = res[0]
            if(post_edit.value.tagi){
              post_edit.value.tagi = JSON.parse(post_edit.value.tagi)
            }
            tytul.value = post_edit.value.tytul
            tekst.value = post_edit.value.tresc
            if(post_edit.value.tagi) selected_tags.value = post_edit.value.tagi
        }
    })
  }

  const toggle_preview = () => {
    document.querySelector('.preview img').src = ""
    document.querySelector('.preview img').onerror = ""
    if(!tekst.value || !tytul.value){
      emit('toast', {type:"error",msg:"Wpisz tytuł/treść!"})
      return
    }
    document.querySelector('.preview div').innerHTML = tekst.value
    document.querySelector('.preview h2 span').innerText = tytul.value
    if(thumbnail.value.files[0]){
      document.querySelector('.preview img').src = thumbnail.value.files[0].objectURL
      document.querySelector('.preview img').onerror =  () => {
          document.querySelector('.preview img').src='../../src/assets/placeholder.png'
      }
    }else if(post_edit.value && post_edit.value.img){
      document.querySelector('.preview img').src = "../../photos/"+post_edit.value.img
      document.querySelector('.preview img').onerror =  () => {
          document.querySelector('.preview img').src='../../src/assets/placeholder.png'
      }
    }
    if(preview.value){
      document.querySelector('body').style = ''
    }else{
      emit('toast', {})
      document.querySelector('body').style = 'overflow: hidden;'
    }
    preview.value = !preview.value
  }

  const dodaj_post = async () => {
    if(!tekst.value || !tytul.value){
      emit('toast', {type:"error",msg:"Wpisz tytuł/treść!"})
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
    }).then(() => {
      emit('toast', {type:"message",msg:"Dodano post!"})
      router.push('/dashboard?toast=true')
    })
  }

  const edytuj_post = async () => {
    if(!tekst.value || !tytul.value){
      emit('toast', {type:"error",msg:"Wpisz tytuł/treść!"})
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
    formData.append('id', post_edit.value.id)
    formData.append('tytul', tytul.value);
    formData.append('tekst', tekst.value);
    formData.append('tagi', selected_tags.value);
    formData.append('img', thumbnail.value.files[0]);
    formData.append("original_img", post_edit.value.img)
    fetch("http://localhost:3000/edytujpost", {
      credentials: 'include',
      method: "POST",
      body: formData
    }).then(() => {
      emit('toast', {type:"message",msg:"Edytowano post!"})
      router.push('/dashboard?toast=true')
    })
  }

  const delete_thumbnail = async () => {
    if (document.querySelector(".decision")) document.querySelector('.decision').remove()
    const response = await decision().then(function () {
        document.querySelector(".decision").remove()
        return
    }, function () {
        document.querySelector(".decision").remove()
        return "stop"
    });
    if(response) return
    fetch("http://localhost:3000/usunimg", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img: post_edit.value.img,
        id: post_edit.value.id
      }),
    }).then(() => {
      emit('toast', {type:"message",msg:"Usunięto miniaturkę!"})
      post_edit.value.img = ""
    })
  }

  const data = ref("")
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  data.value = yyyy + '-' + mm + '-' + dd
</script>

<template>
  <div>
  <div v-if="user" class="px-8 md:px-16 mb-40">
    <h1 class="text-center font-semibold text-gray-900 mb-10 text-4xl mt-16 dark:text-slate-200">
      <span v-if="post_edit">Edytuj post</span>
      <span v-else>Nowy post</span>
    </h1>
    <input v-model="tytul" type='text' maxlength="200" placeholder='Tytuł' class="w-full rounded-md py-3 px-4 bg-gray-100 dark:bg-neutral-700 text-sm outline-[#007bff] dark:text-slate-200 mb-5" />
    <div v-if="post_edit && post_edit.img" class="flex flex-wrap">
      <img class="mb-4 max-w-96 mr-4" :src="'../../photos/'+post_edit.img" onerror="this.src='../../src/assets/placeholder.png'">
      <div @click="delete_thumbnail" class="rounded-md mb-4 px-5 h-fit cursor-pointer text-white bg-violet-600 float-left p-3"><i class="fa fa-trash mr-3"></i>Usuń</div>
    </div>
    <FileUpload :invalidFileTypeMessage="'Wybrano zły format pliku!'" :chooseLabel="post_edit ? 'Zmień miniaturkę' : 'Dodaj miniaturkę'" :cancelLabel="'Anuluj'" ref="thumbnail" name="thumbnail[]" accept="image/*" :showUploadButton="false" :fileLimit="1">
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
        </span>
        <span class="ql-formats">
          <button class="ql-code-block"></button>
          <button class="ql-blockquote"></button>
        </span>
    </template>
      </Editor>
      <div @click="toggle_preview" class="rounded-md my-5 px-5 cursor-pointer text-white bg-violet-600 float-left p-3"><i class="fa fa-search mr-3"></i>Podgląd</div>
      <div v-if="post_edit" @click="edytuj_post" class="rounded-md my-5 ml-2 px-5 cursor-pointer text-white bg-violet-600 float-left p-3"><i class="fa fa-pencil mr-3"></i>Edytuj</div>
      <div v-else @click="dodaj_post" class="rounded-md my-5 ml-2 px-5 cursor-pointer text-white bg-violet-600 float-left p-3"><i class="fa fa-circle-plus mr-3"></i>Dodaj</div>
  </div>

  <div class="preview z-50 max-h-full overflow-y-scroll px-6 lg:px-8 fixed top-0 left-0 right-0 min-h-full bg-white dark:bg-neutral-950" :class="preview ? 'block' : 'hidden'">
    <h1 class="text-center font-semibold text-gray-900 text-4xl mt-16 dark:text-slate-200">Podgląd</h1>
    <h2 class="font-semibold text-gray-900 text-5xl my-10 mt-16 dark:text-slate-200">
      <span></span>
      <span class="text-lg ml-2 dark:text-slate-400 font-normal mt-6 text-slate-600">{{ data }}</span>
      <span v-for="tag in selected_tags" class="rounded-md dark:bg-indigo-700 bg-purple-50 px-2 py-1 text-sm dark:text-indigo-200 text-purple-700 ring-1 ring-inset ring-purple-700/10 ml-2">{{ tag }}</span>
    </h2>
    <img>
    <div class="break-words md:pr-36 text-lg py-10 text-gray-700 dark:text-slate-400"></div>
    <i @click="toggle_preview" class="fa fa-close text-4xl absolute top-5 right-7 cursor-pointer"></i>
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