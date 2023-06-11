/** Return an icon representing a battery state. */

const BATTERY_ICONS_NAME = {
  10: 'mdi:battery-10',
  20: 'mdi:battery-20',
  30: 'mdi:battery-30',
  40: 'mdi:battery-40',
  50: 'mdi:battery-50',
  60: 'mdi:battery-60',
  70: 'mdi:battery-70',
  80: 'mdi:battery-80',
  90: 'mdi:battery-90',
  100: 'mdi:battery',
};
const BATTERY_CHARGING_ICONS_NAME = {
  10: 'mdi:battery-charging-10',
  20: 'mdi:battery-charging-20',
  30: 'mdi:battery-charging-30',
  40: 'mdi:battery-charging-40',
  50: 'mdi:battery-charging-50',
  60: 'mdi:battery-charging-60',
  70: 'mdi:battery-charging-70',
  80: 'mdi:battery-charging-80',
  90: 'mdi:battery-charging-90',
  100: 'mdi:battery-charging',
};

export const batteryStateIconName = (batteryState, batteryChargingState) => {
  const battery = batteryState.state;
  const batteryCharging = batteryChargingState && batteryChargingState.state === 'on';

  // eslint-disable-next-line no-use-before-define
  return batteryIconName(battery, batteryCharging);
};

export const batteryIconName = (batteryState, batteryCharging) => {
  const batteryValue = Number(batteryState);
  if (isNaN(batteryValue)) {
    if (batteryState === 'off') {
      return 'mdi:battery';
    }
    if (batteryState === 'on') {
      return 'mdi:battery-alert';
    }
    return 'mdi:battery-unknown';
  }

  const batteryRound = Math.round(batteryValue / 10) * 10;
  if (batteryCharging && batteryValue >= 10) {
    return BATTERY_CHARGING_ICONS_NAME[batteryRound];
  }
  if (batteryCharging) {
    return 'mdi:battery-charging-outline';
  }
  if (batteryValue <= 5) {
    return 'mdi:battery-alert-variant-outline';
  }
  return BATTERY_ICONS_NAME[batteryRound];
};
