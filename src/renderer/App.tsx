import { HashRouter, Route, Routes } from 'react-router-dom';

import ScreenNotFound from '@/renderer/screens/ScreenNotFound';
import Main from '@/renderer/screens/Main';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/">
        <Route index element={<Main />} />
        <Route path="*" element={ScreenNotFound()} />
      </Route>
    </Routes>
  </HashRouter>
);

export default App;
