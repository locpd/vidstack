import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { useMediaContext } from '../../../../../../core/api/media-context';
import { $i18n } from '../utils';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuItem } from './items/menu-items';


export function DefaultDualCaptionsMenuCheckbox() {
  const { remote } = useMediaContext(),
    { translations } = useDefaultLayoutContext(),
    label = 'Dual Captions Separation';

  return DefaultMenuItem({
    label: $i18n(translations, label),
    children: DefaultMenuCheckbox({
      label,
      storageKey: 'vds-player::user-dual-captions-separation',
      onChange(checked, trigger) {
        remote.userDualCaptionChange(checked, trigger);
      },
    }),
  });
}
