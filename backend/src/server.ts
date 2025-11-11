import app from './app';
import env from './config/env';

app.listen(env.PORT, () => {
  console.log(`API is listening on http://${env.HOST}:${env.PORT} (stage=${env.APP_STAGE})`);
})
