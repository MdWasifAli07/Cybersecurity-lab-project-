import importlib
import inspect
import pkgutil
from modules.base_module import ScanModule


def load_modules(enabled_names=None):
    """
    Auto-discover every ScanModule subclass in the modules/ package.
    Filters by `enabled_names` if provided, otherwise uses each module's .enabled flag.
    """
    modules_pkg = importlib.import_module("modules")
    instances = []

    for _, name, _ in pkgutil.iter_modules(modules_pkg.__path__):
        if name.startswith("base_") or name.startswith("__"):
            continue
        mod = importlib.import_module(f"modules.{name}")
        for _, cls in inspect.getmembers(mod, inspect.isclass):
            if issubclass(cls, ScanModule) and cls is not ScanModule:
                try:
                    instances.append(cls())
                except Exception as e:
                    print(f"[registry] Failed to instantiate {cls.__name__}: {e}")

    if enabled_names:
        instances = [m for m in instances if m.name in enabled_names]
    else:
        instances = [m for m in instances if m.enabled]

    return instances