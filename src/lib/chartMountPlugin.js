import { Chart as ChartJS } from 'chart.js';

// Plugin: forces chart to reset and animate on mount
const mountAnimatePlugin = {
  id: 'mountAnimatePlugin',
  afterInit(chart) {
    // mark chart for mount animation
    chart.$shouldAnimateOnMount = true;
  },
  afterDraw(chart) {
    if (!chart.$shouldAnimateOnMount) return;
    // only run once per chart
    chart.$shouldAnimateOnMount = false;
    // Use a tiny timeout to let layout settle then reset+update to trigger animation
    setTimeout(() => {
      try {
        chart.reset();
        chart.update();
      } catch (e) {
        // ignore errors during mount animation
        // console.warn('mountAnimatePlugin error', e);
      }
    }, 50);
  },
};

ChartJS.register(mountAnimatePlugin);

export default mountAnimatePlugin;
