<template>
  <input type="file" accept="image/*" @change="onFileSelect" />
  <VuePictureCropper
    ref="vpcRef"
    :img="cropperProps.img"
    :options="cropperProps.options"
    :preset-mode="cropperProps.presetMode"
  />
  <Button severity="info" size="small" @click="onCrop">Crop</Button>
</template>

<script setup lang="ts">
    import { Button } from 'primevue'
    import { ref, computed } from 'vue'
    import VuePictureCropper, { type VuePictureCropperProps } from 'vue-picture-cropper'

    const originalPreview = ref<string | null>(null)
    const presetSize = ref(300) 
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
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
        originalPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    }

    async function onCrop() {
    const file = await cropper.value?.getFile({ fileName: 'avatar.png' })
        if(file){
            emit('get-file',file);
        }

    }
</script>