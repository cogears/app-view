<script setup lang="ts">
import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import 'quill/dist/quill.snow.css';
import { onMounted, ref } from 'vue';

Quill.register("modules/imageUploader", ImageUploader);

const props = withDefaults(defineProps<{
    value: string,
    placeholder?: string,
    upload?: (file: File) => Promise<string>
}>(), {
    placeholder: '请输入内容...'
})

const emits = defineEmits<{
    (e: 'update:value', value: string): void
}>()

defineExpose({
    setValue(content: string) {
        if (quill.value) {
            quill.value.root.innerHTML = content
        }
    },
    getValue() {
        if (quill.value) {
            return quill.value.root.innerHTML
        }
    }
})

const self = ref<HTMLDivElement>()
const editor = ref<HTMLDivElement>()
const quill = ref<any>()
onMounted(() => {
    if (editor.value) {
        const options: any = {
            debug: 'warn',
            bounds: self.value,
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote', 'code-block'],
                    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme

                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ align: [] }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction
                    ['link', 'video', 'image'],
                    ['clean'], // remove formatting button
                ],
            },
            placeholder: props.placeholder,
            theme: 'snow'
        };
        if (props.upload) {
            options.modules.imageUploader = {
                upload: props.upload
            }
        }
        quill.value = new Quill(editor.value, options);
        quill.value.on('text-change', () => {
            emits('update:value', quill.value.root.innerHTML)
        })
        quill.value.root.innerHTML = props.value
    }
})


</script>
<template>
    <div class="html-editor" ref="self">
        <div class="html-editor-quill" ref="editor">
        </div>
    </div>
</template>
<style scoped lang="scss">
.html-editor {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 480px;

    .html-editor-quill {
        flex: 1;
        overflow: hidden;
    }
}
</style>