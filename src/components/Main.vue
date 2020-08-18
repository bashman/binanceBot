<template>
    <div>
        <Balances />
        <StochRSI />
    </div>
  
</template>

<script>
import Balances from './Balances';
import StochRSI from './StochRSI.vue';

export default {
    components: { Balances, StochRSI }
}
</script>

<style>

</style>