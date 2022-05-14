<template>

    <section id="home" class="banner_section section_gradiant_dark">
        <div id="banner_bg_effect" class="banner_effect"></div>
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 col-md-12 col-sm-12 order-lg-first text_md_center">
                    <div class="banner_text">
                        <h1 class="animate__animated animate__fadeInUp" data-animation="fadeInUp" data-animation-delay="0.5s">
                            <span>{{title_blue}}</span> {{title_white}}</h1>
                        <h3 class="animate__animated animate__fadeInUp" data-animation="fadeInUp" data-animation-delay="0.6s">{{heading}}</h3>
                        <p class="animate__animated animate__fadeInUp" data-animation="fadeInUp" data-animation-delay="0.7s">{{info}}</p>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12 order-first text-right">
                    <img class="banner-img" :src="image" v-if="image !== ''">
                </div>
            </div>
        </div>
        <div style="background-image:url('@/assets/images/banner_wave.png');" class="section_wave"></div>
    </section>
</template>

<script>
    export default {
        name: "BannerTop",
        props: {
            title_blue: String,
            title_white: String,
            heading: String,
            info: String,
            image: String,
        }
    }
</script>

<style scoped>
.banner-img {
    max-height: 250px;
}
</style>