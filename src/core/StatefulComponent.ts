import {Component} from "react";
import {ViewModel, ViewModelProps} from "./ViewModel";
import {Lifecycle, LifecycleOwner, LifecycleRegistry} from "./LifecycleOwner";
import {Type} from "./Type";
import {container} from "tsyringe";

export abstract class StatefulComponent<VM extends ViewModel<S>, S, P extends ViewModelProps<VM>>
    extends Component<P, S>
    implements LifecycleOwner {
    lifecycle: Lifecycle;
    private childViewModels = new Map<string, ViewModel<any>>()

    public vm: VM;

    protected constructor(props: P) {
        super(props);
        this.vm = props.viewModel
        this.lifecycle = new LifecycleRegistry()
        if (this.vm.state != null) {
            this.state = this.vm.state.getValue()
            this.vm.state.collectIn(this, it => {
                this.setState(it)
            })
        }
    }

    protected invalidate() {
        this.setState(this.state)
    }

    protected viewModelOf<T extends ViewModel<any>>(vmType: Type<T>): T {
        let key = vmType.name

        let childViewModel = this.childViewModels.get(key)
        if (childViewModel == null) {
            childViewModel = container.resolve(vmType)
            this.childViewModels.set(key, childViewModel)
        }
        return childViewModel as T
    }

    componentDidMount() {
        this.vm.onAttached();
        (this.lifecycle as LifecycleRegistry).mount()
    }

    componentWillUnmount() {
        (this.lifecycle as LifecycleRegistry).unmount();
        this.vm.onDetached();
    }

}