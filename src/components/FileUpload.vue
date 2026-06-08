<template>


  <div v-if="fileNameVisibility">
    <input type="file" accept="image/*" @change="onFileSelect" class="truncate" />
  </div>

  <template v-else>
    <p class="truncate w-[10em]">{{ fileName }}</p>
    <p>{{ fileName.split('.').pop() }}</p>
    <Button icon="pi pi-check" rounded aria-label="File uploaded check" />
  </template>

  <Dialog v-model:visible="visible" modal header="Crop Image" :style="{ width: '25rem' }">
        <VuePictureCropper
            ref="vpcRef"
            :img="cropperProps.img"
            :options="cropperProps.options"
            :preset-mode="cropperProps.presetMode"
        />
        <Button severity="info" size="small" @click="onCrop" class="mt-2">Crop</Button>
  </Dialog>
</template>
<script setup lang="ts">
    import { Button, Dialog} from 'primevue'
    import { ref, computed } from 'vue'
    import VuePictureCropper, { type VuePictureCropperProps } from 'vue-picture-cropper'

    const originalPreview = ref<string | null>(null)
    const presetSize = ref(250);
    const visible = ref(false);
    const fileNameVisibility = ref(true);
    const fileName = ref("");
    const cropperProps = computed<VuePictureCropperProps>(() => ({
    img: originalPreview.value ?? '',
    options: {
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        cropBoxResizable: false,
    },
    presetMode: {
        mode: 'round',
        width: presetSize.value,
    },
    }))

    const vpcRef = ref<InstanceType<typeof VuePictureCropper> | null>(null);
    const cropper = computed(() => vpcRef.value?.cropper ?? null);
    const emit = defineEmits<{(e:'get-file',file:File):void}>()

    function onFileSelect(event: Event) {
    visible.value = true;
    
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
        originalPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    fileNameVisibility.value = false;
    fileName.value = file.name;
    }

    async function onCrop() {
    const file = await cropper.value?.getFile({ fileName: 'avatar.png' })
        if(file){
            emit('get-file',file);
            visible.value = false;
        }
    }
</script>