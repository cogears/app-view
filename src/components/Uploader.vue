<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import ViewContext from '../ViewContext';
import Loading from './Loading.vue';
import IconClose from './icons/IconClose.vue'
import { UploadFileItem } from 'types';

const context = inject(ViewContext.NAME) as ViewContext
const props = withDefaults(defineProps<{
    type: 'image' | 'audio' | 'video' | '',
    accept?: string,
    value: UploadFileItem[],
    limit?: number,
    upload: (file: File) => Promise<string>,
}>(), {
    limit: 1
})

const accept0 = computed(() => {
    switch (props.type) {
        case 'image':
            return props.accept || 'image/png,image/jpeg,image/gif'
        case 'audio':
            return props.accept || '.mp3,.m4a'
        case 'video':
            return props.accept || 'video/mp4'
        default:
            return props.accept
    }
})

const input = ref<HTMLInputElement>()

const tasks = ref<Task[]>([])

const emits = defineEmits<{
    (e: 'change'): void
}>()

function onChange() {
    if (input.value && input.value.files && input.value.files.length > 0) {
        for (let i = 0; i < input.value.files.length; i++) {
            if (props.value.length + tasks.value.length < props.limit) {
                let file = input.value.files[i];
                tasks.value.push(new Task(file))
            } else {
                context.device.toast('最多选择' + props.limit + '个文件')
                break
            }
        }
        input.value.value = ''
    }
}
function onRemove(i: number) {
    props.value.splice(i, 1)
    emits('change')
}

function onRemoveTask(i: number) {
    tasks.value.splice(i, 1)
}

class Task {
    readonly file: File
    readonly url: string
    readonly name: string
    width: number = 0
    height: number = 0
    size: number = 0
    duration: number = 0
    constructor(file: File) {
        this.file = file
        this.name = file.name
        this.size = file.size
        this.url = URL.createObjectURL(file)
        this.startUpload(file)
    }

    async startUpload(file: File) {
        let url = await props.upload(file)
        props.value.push({ url, name: this.name, width: this.width, height: this.height, size: this.size, duration: this.duration })
        emits('change')
        if (tasks.value) {
            let i = tasks.value.indexOf(this)
            if (i >= 0) {
                tasks.value.splice(i, 1)
            }
        }
    }
}

function onImageLoaded(e: any, task: Task) {
    task.width = e.target.naturalWidth
    task.height = e.target.naturalHeight
}

function onVideoLoad(e: any, item: any) {
    let media = e.target as HTMLMediaElement
    item.duration = Math.floor(media.duration)
}
</script>
<template>
    <div class="uploader-struct" :class="type">
        <div class="image-view" v-if="type == 'image'">
            <div class="box border" v-for="(item, i) in value">
                <img :src="item.url">
                <a class="close" @click="onRemove(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border task" v-for="(task, i) in tasks">
                <img :src="task.url" @load="onImageLoaded($event, task)">
                <div class="load-mask">
                    <Loading visible></Loading>
                </div>
                <a class="close" @click="onRemoveTask(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border upload" v-if="value.length + tasks.length < limit">
                <div class="tip">点击上传</div>
                <input ref="input" type="file" :multiple="limit > 1" :accept="accept0" @change="onChange">
            </div>
        </div>
        <div class="video-view" v-if="type == 'video'">
            <div class="video" v-for="(item, i) in value">
                <video :src="item.url" @loadeddata="onVideoLoad($event, item)" controls></video>
                <a class="close" @click="onRemove(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border task" v-for="(_task, i) in tasks">
                <div class="load-mask">
                    <Loading visible></Loading>
                </div>
                <a class="close" @click="onRemoveTask(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border upload" v-if="value.length + tasks.length < limit">
                <div class="tip">点击上传</div>
                <input ref="input" type="file" :multiple="limit > 1" :accept="accept0" @change="onChange">
            </div>
        </div>
        <div class="audio-view" v-if="type == 'audio'">
            <div class="video" v-for="(item, i) in value">
                <audio :src="item.url" @loadeddata="onVideoLoad($event, item)" controls></audio>
                <a class="close" @click="onRemove(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border task" v-for="(_task, i) in tasks">
                <div class="load-mask">
                    <Loading visible></Loading>
                </div>
                <a class="close" @click="onRemoveTask(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border upload" v-if="value.length + tasks.length < limit">
                <div class="tip">点击上传</div>
                <input ref="input" type="file" :multiple="limit > 1" :accept="accept0" @change="onChange">
            </div>
        </div>
        <div class="file-view" v-if="type == ''">
            <div class="file" v-for="(item) in value">{{ item.name }}</div>
            <div class="box border task" v-for="(_task, i) in tasks">
                <div class="load-mask">
                    <Loading visible></Loading>
                </div>
                <a class="close" @click="onRemoveTask(i)">
                    <IconClose />
                </a>
            </div>
            <div class="box border upload" v-if="value.length + tasks.length < limit">
                <div class="tip">点击上传</div>
                <input ref="input" type="file" :multiple="limit > 1" :accept="accept0" @change="onChange">
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.uploader-struct {
    .label {
        padding: 10px 0;
        line-height: 1;
    }
}

.image-view {
    display: flex;
    flex-wrap: wrap;
    width: 320px;
}

.box {
    position: relative;
    width: 96px;
    height: 96px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-width: 1px;

    .load-mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.1);
        color: white;
    }

    .close {
        position: absolute;
        right: 0;
        top: 0;
        width: 16px;
        height: 16px;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background-color: black;
        opacity: 0.7;
        fill: white;
    }

    .tip {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
    }

    input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    &.task {
        background-color: black;
    }

    &.upload {
        border-style: dashed;
    }

}

.video-view {
    .video {
        position: relative;
        width: 300px;
        height: 200px;
        background-color: black;

        video {
            width: 100%;
            height: 100%;
        }

        .close {
            position: absolute;
            right: 0;
            top: 0;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background-color: black;
            opacity: 0.7;
        }
    }
}
</style>