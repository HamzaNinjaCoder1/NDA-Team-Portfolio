import { supportsWebp } from '../lib/imageSupport';

import aboutImageJpg from './images/about_architecture_1785673852783.jpg';
import aboutImageWebp from './images/about_architecture_1785673852783.webp';
import section6Jpg from './images/section6_right_image.png';
import section6Webp from './images/section6_right_image.webp';
import serviceWebDesignJpg from './images/service_web_design_1785678016624.jpg';
import serviceWebDesignWebp from './images/service_web_design_1785678016624.webp';
import serviceWebDevJpg from './images/service_web_dev_1785678035261.jpg';
import serviceWebDevWebp from './images/service_web_dev_1785678035261.webp';
import serviceBrandJpg from './images/service_brand_strategy_1785678050686.jpg';
import serviceBrandWebp from './images/service_brand_strategy_1785678050686.webp';
import serviceVisualJpg from './images/service_visual_identity_1785678066566.jpg';
import serviceVisualWebp from './images/service_visual_identity_1785678066566.webp';
import serviceMotionJpg from './images/service_motion_3d_1785678083789.jpg';
import serviceMotionWebp from './images/service_motion_3d_1785678083789.webp';
import serviceContentJpg from './images/service_content_art_1785678105992.jpg';
import serviceContentWebp from './images/service_content_art_1785678105992.webp';
import alexJpg from '../../project images/Alex.jpg';
import alexWebp from '../../project images/Alex.webp';
import nakashimaJpg from '../../project images/Nakashima.jpg';
import nakashimaWebp from '../../project images/Nakashima.webp';
import oleksandrJpg from '../../project images/Oleksandr.jpg';
import oleksandrWebp from '../../project images/Oleksandr.webp';
import musicRacingJpg from '../../project images/Music Racing.jpg';
import musicRacingWebp from '../../project images/Music Racing.webp';
import rajampoJpg from '../../project images/rajampo.jpg';
import rajampoWebp from '../../project images/rajampo.webp';
import evermergeJpg from '../../project images/EverMerge.jpg';
import evermergeWebp from '../../project images/EverMerge.webp';
import lotusJpg from '../../project images/Lotus car.jpg';
import lotusWebp from '../../project images/Lotus car.webp';

const HOME_IMAGES: Array<{ src: string; webp: string }> = [
  { src: aboutImageJpg, webp: aboutImageWebp },
  { src: section6Jpg, webp: section6Webp },
  { src: serviceWebDesignJpg, webp: serviceWebDesignWebp },
  { src: serviceWebDevJpg, webp: serviceWebDevWebp },
  { src: serviceBrandJpg, webp: serviceBrandWebp },
  { src: serviceVisualJpg, webp: serviceVisualWebp },
  { src: serviceMotionJpg, webp: serviceMotionWebp },
  { src: serviceContentJpg, webp: serviceContentWebp },
  { src: alexJpg, webp: alexWebp },
  { src: nakashimaJpg, webp: nakashimaWebp },
  { src: oleksandrJpg, webp: oleksandrWebp },
  { src: musicRacingJpg, webp: musicRacingWebp },
  { src: rajampoJpg, webp: rajampoWebp },
  { src: evermergeJpg, webp: evermergeWebp },
  { src: lotusJpg, webp: lotusWebp },
];

const webpSupported = supportsWebp();

export const HOME_IMAGE_SOURCES: string[] = HOME_IMAGES.map(image => (webpSupported ? image.webp : image.src));
