<script lang='ts' setup>
import formatter from '../common/formatter';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ViewContext, { Transaction } from '../ViewContext';
import { CALENDAR } from './index';
import IconNext from '../components/icons/IconNext.vue';
import IconNext2 from '../components/icons/IconNext2.vue';

const context = inject(ViewContext.NAME) as ViewContext
const temp = reactive({
    visible: false,
    today: new Date(),
    year: 0,
    month: 0,
    days: 0,
    week: 0,
    x: 0,
    y: 0,
})
const origin = ref<Date>()
const current = ref<Date>()
const style = computed(() => ({ left: temp.x + 'px', top: temp.y + 'px' }))
const WIDTH = 350
const HEIGHT = 360
let dt = new Date()
let dialogTransaction: Transaction<any>
onMounted(() => {
    context.device.addEventListener(CALENDAR, onShow)
})

function onShow(_: string, transaction: Transaction<any>, date: Date | undefined, pos: { x: number, y: number, width: number, height: number }) {
    dialogTransaction = transaction
    origin.value = date
    current.value = date
    temp.today = new Date()
    temp.x = pos.x
    temp.y = pos.y + pos.height
    temp.visible = true;
    if (temp.x + WIDTH > window.innerWidth) {
        temp.x = pos.x + pos.width - WIDTH
    }
    if (temp.y + HEIGHT > window.innerHeight) {
        temp.y = pos.y - HEIGHT
    }
    document.onmousedown = onClose
    update()
}
function onClose() {
    document.onmousedown = null;
    temp.visible = false;
    if (current.value) {
        if (origin.value) {
            let originDate = formatter.date(origin.value.getTime())
            let newDate = formatter.date(current.value.getTime())
            if (originDate == newDate) {
                dialogTransaction.abort()
            } else {
                dialogTransaction.next(current.value)
            }
        } else {
            dialogTransaction.next(current.value)
        }
    } else {
        dialogTransaction.abort()
    }
    current.value = undefined
}
function onChangeYear(offset: number) {
    dt.setFullYear(dt.getFullYear() + offset);
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(0);
    temp.days = dt.getDate();
    dt.setDate(1);
    temp.week = dt.getDay();
    temp.year = dt.getFullYear();
    temp.month = dt.getMonth();
}
function onChangeMonth(offset: number) {
    dt.setMonth(dt.getMonth() + offset);
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(0);
    temp.days = dt.getDate();
    dt.setDate(1);
    temp.week = dt.getDay();
    temp.year = dt.getFullYear();
    temp.month = dt.getMonth();
}

function onSelected(date: number) {
    let target = new Date(dt.getTime());
    target.setDate(date);
    current.value = target
    onClose()
}

function onSetToday() {
    current.value = new Date()
    update()
}

function isToday(date: number) {
    return temp.today.getFullYear() == temp.year && temp.today.getMonth() == temp.month && temp.today.getDate() == date;
}
function isDay(date: number) {
    return current.value && current.value.getFullYear() == temp.year && current.value.getMonth() == temp.month && current.value.getDate() == date;
}

function update() {
    dt = new Date();
    if (current.value) {
        dt.setTime(current.value.getTime());
    }
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(0);
    temp.days = dt.getDate();
    dt.setDate(1);
    temp.week = dt.getDay();
    temp.year = dt.getFullYear();
    temp.month = dt.getMonth();
}


</script>
<template>
    <Transition>
        <div ref="content" class="calendar popup" :style="style" v-if="temp.visible" @mousedown.stop>
            <div class="title border">
                <a @click="onChangeYear(-1)">
                    <IconNext2 direction="left"></IconNext2>
                </a>
                <a @click="onChangeMonth(-1)">
                    <IconNext direction="left"></IconNext>
                </a>
                <span>{{ temp.year }}年{{ temp.month + 1 }}月</span>
                <a @click="onChangeMonth(1)">
                    <IconNext></IconNext>
                </a>
                <a @click="onChangeYear(1)">
                    <IconNext2></IconNext2>
                </a>
            </div>
            <div class="days text2">
                <span>日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span>六</span>
            </div>
            <div class="days list">
                <span v-for="n in temp.week" :key="'p' + n"></span>
                <span v-for="n in temp.days" :key="n">
                    <a :class="{ selected: isDay(n), today: isToday(n) }" @click="onSelected(n)">
                        {{ formatter.n2(n) }}
                    </a>
                </span>
            </div>
            <div class="bottom border">
                <i @click="onSetToday"></i>
                <label>今天: {{ formatter.date(temp.today.getTime()) }}</label>
            </div>
        </div>
    </Transition>
</template>
<style lang='scss' scoped>
$unit-width: 50px;
$unit-height: 40px;
$size: 24px;

.calendar {
    position: fixed;
    width: 350px;
    z-index: 25;

    .title {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 var(--size-padding);
        border-bottom-width: 1px;

        span {
            flex: 1;
            text-align: center;
        }

        a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            fill: var(--color-text2);

            &:hover {
                fill: var(--color-app);
            }
        }
    }

    .days {
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;

        &.list {
            height: 240px;
        }

        span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: $unit-width;
            height: $unit-height;

            a {
                display: flex;
                align-items: center;
                justify-content: center;
                width: $size;
                height: $size;

                &.today {
                    border: 1px solid var(--color-app);
                    color: var(--color-app);
                }

                &.mark {
                    color: var(--color-app);
                }

                &:hover {
                    background-color: var(--color-app);
                    color: var(--color-white);
                }

                &.selected {
                    background-color: var(--color-app);
                    color: var(--color-white);
                }
            }
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-width: 1px;
        height: 40px;

        i {
            width: $size;
            height: $size;
            margin-right: 4px;
            border: 1px solid var(--color-app);
        }
    }
}
</style>