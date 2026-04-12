import { html } from 'lit-html';
import { computed, signal, type ReadSignal } from 'maverick.js';
import { isFunction, unwrap } from 'maverick.js/std';



import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import type { MenuPlacement } from '../../../../../../components/ui/menu/menu-items';
import type { TooltipPlacement } from '../../../../../../components/ui/tooltip/tooltip-content';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { IconSlot } from '../../slots';
import { $i18n } from '../utils';
import { MenuPortal } from './menu-portal';


export function DefaultCaptionsMenu({
  placement,
  portal,
  tooltip,
}: {
  portal?: boolean;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
}) {
  return $signal(() => {
    const {
        translations,
        menuPortal,
        noModal,
        menuGroup,
        smallWhen: smWhen,
      } = useDefaultLayoutContext(),
      { viewType, hasCaptions } = useMediaState(),
      $offText = $i18n(translations, 'Off');

    if (!hasCaptions()) return null;

    const $placement = computed(() =>
        noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
      ),
      $offset = computed(() =>
        !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
      ),
      $isOpen = signal(false);

    function onOpen() {
      $isOpen.set(true);
    }

    function onClose() {
      $isOpen.set(false);
    }

    const items = html`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${$signal($placement)}
        offset=${$signal($offset)}
      >
        ${$signal(() => {
          if (!$isOpen()) {
            return null;
          }

          return html`
            <media-captions-radio-group
              class="vds-captions-radio-group vds-radio-group"
              off-label=${$offText}
            >
              <template>
                <media-radio class="vds-caption-radio vds-radio">
                  <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                  <span class="vds-radio-label" data-part="label"></span>
                </media-radio>
              </template>
            </media-captions-radio-group>
          `;
        })}
      </media-menu-items>
    `;

    return html`
      <media-menu class="vds-captions-menu vds-menu" @open=${onOpen} @close=${onClose}>
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${$i18n(translations, 'Captions')}
            >
              ${IconSlot('cc-off')}
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
          >
            ${$i18n(translations, 'Captions')}
          </media-tooltip-content>
        </media-tooltip>
        ${portal ? MenuPortal(menuPortal, items) : items}
      </media-menu>
    `;
  });
}
