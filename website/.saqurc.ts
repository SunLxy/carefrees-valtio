
import { defineConfig } from 'saqu';

export default () => defineConfig({
  output: {
    publicPath: "./"
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.md$/,
  //       use: ['@saqu/loader-md-react-preview'],
  //       type: 'typescript',
  //     },
  //   ],
  // },
});
