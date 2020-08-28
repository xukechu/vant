import { ref, reactive, provide } from 'vue';
import { createNamespace, isDef } from '../utils';
import { BORDER_TOP_BOTTOM } from '../utils/constant';
import { useHeight } from '../composition/use-rect';

const [createComponent, bem] = createNamespace('tabbar');

export const TABBAR_KEY = 'vanTabbar';

export default createComponent({
  props: {
    route: Boolean,
    zIndex: [Number, String],
    placeholder: Boolean,
    activeColor: String,
    inactiveColor: String,
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    border: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: null,
    },
  },

  emits: ['change', 'update:modelValue'],

  setup(props, { emit, slots }) {
    const tabbarRef = ref();
    const height = useHeight(tabbarRef);
    const children = reactive([]);

    const isUnfit = () => {
      if (isDef(props.safeAreaInsetBottom)) {
        return !props.safeAreaInsetBottom;
      }
      // enable safe-area-inset-bottom by default when fixed
      return !props.fixed;
    };

    const renderTabbar = () => {
      const { fixed, zIndex, border } = props;
      const unfit = isUnfit();
      return (
        <div
          ref={tabbarRef}
          style={{ zIndex }}
          class={[bem({ unfit, fixed }), { [BORDER_TOP_BOTTOM]: border }]}
        >
          {slots.default?.()}
        </div>
      );
    };

    const setActive = (active) => {
      if (active !== props.modelValue) {
        emit('update:modelValue', active);
        emit('change', active);
      }
    };

    provide(TABBAR_KEY, {
      props,
      children,
      setActive,
    });

    return () => {
      if (props.fixed && props.placeholder) {
        return (
          <div
            class={bem('placeholder')}
            style={{ height: height.value ? `${height.value}px` : null }}
          >
            {renderTabbar()}
          </div>
        );
      }

      return renderTabbar();
    };
  },
});
