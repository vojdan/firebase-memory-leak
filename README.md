# Firebase test behavior

## Env

OS: `MacOS Monterey 12.5`, `MacBook Pro Apple M1 Max`, `64 GB`

node --version: `v16.16.0`

firebase --version: `11.4.2`

## Install dependencies

`npm i`

# Issue #1 - flaky tests

### Things tried

Source: `https://firebase.google.com/docs/firestore/security/test-rules-emulator#test_behavior_is_inconsistent`

- Add security rules on each test run
- Make sure we `await` everything

### Start firebase emulators (in terminal #1)

`npm run emulators:test`

### Run tests in watch mode (in terminal #2)

`npm run test:watch`

### Expected behavior

Tests always pass.

### Actual behvaior

Tests pass/fail randomly. Re-run tests to observe.

### Re-run tests

Press `Enter` in `terminal #2` after test run finishes. Tests will intermitently fail/pass.

### Error message printed in terminal #1

`Permission denied because no Storage ruleset is currently loaded, check your rules for syntax errors.`

### Error message printed in terminal #2

`Firebase Storage: User does not have permission to access 'alice/folder'. (storage/unauthorized)`

![](https://github.com/vojdan/firebase-memory-leak/blob/main/flaky-tests.gif)

# Issue #2 - memory leak

### Things tried

- Experiment with heap size `--max-old-space-size=4096`

### Start firebase emulators (in terminal #1)

`npm run emulators:test`

### Run tests in watch mode (in terminal #2)

`npm run test:memleak`

### Expected behavior

Tests finish without error.

### Actual behvaior

Memory leak in tests. Each test increases memory by 8-11MB.

### Re-run tests

Press `Enter` in `terminal #2` after test run finishes.

![](https://github.com/vojdan/firebase-memory-leak/blob/main/memleak.gif)

### Error message

```
 PASS  src/test_11.test.ts (3242 MB heap size)
 PASS  src/test_111.test.ts (3251 MB heap size)
 PASS  src/test_1111.test.ts (3259 MB heap size)
 PASS  src/test_11111.test.ts (3267 MB heap size)
 PASS  src/test_1.test.ts (3276 MB heap size)
 PASS  src/test_111111111.test.ts (3284 MB heap size)
 PASS  src/test_11111111.test.ts (3293 MB heap size)
 PASS  src/test_1111111111.test.ts (3301 MB heap size)

 RUNS  src/test_111111.test.ts

<--- Last few GCs --->

[17051:0x140008000]   159216 ms: Scavenge 3319.3 (3791.1) -> 3313.1 (3791.1) MB, 11.1 / 0.0 ms  (average mu = 0.378, current mu = 0.374) allocation failure
[17051:0x140008000]   159629 ms: Mark-sweep 3316.4 (3791.6) -> 3301.2 (3790.0) MB, 385.6 / 0.0 ms  (average mu = 0.363, current mu = 0.349) testing GC in old space requested
[17051:0x140008000]   159802 ms: Scavenge 3327.7 (3797.4) -> 3321.4 (3797.4) MB, 11.5 / 0.1 ms  (average mu = 0.363, current mu = 0.349) allocation failure


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 0x1021f86e8 node::Abort() [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 2: 0x1021f8870 node::errors::TryCatchScope::~TryCatchScope() [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 3: 0x102348000 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 4: 0x102347f94 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 5: 0x1024cb6ac v8::internal::Heap::GarbageCollectionReasonToString(v8::internal::GarbageCollectionReason) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 6: 0x1024cecbc v8::internal::Heap::CollectSharedGarbage(v8::internal::GarbageCollectionReason) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 7: 0x1024cbe74 v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 8: 0x1024c979c v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
 9: 0x1024cad94 v8::internal::Heap::PreciseCollectAllGarbage(int, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
10: 0x1023b4ea8 v8::internal::FunctionCallbackArguments::Call(v8::internal::CallHandlerInfo) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
11: 0x1023b49a0 v8::internal::MaybeHandle<v8::internal::Object> v8::internal::(anonymous namespace)::HandleApiCallHelper<false>(v8::internal::Isolate*, v8::internal::Handle<v8::internal::HeapObject>, v8::internal::Handle<v8::internal::HeapObject>, v8::internal::Handle<v8::internal::FunctionTemplateInfo>, v8::internal::Handle<v8::internal::Object>, v8::internal::BuiltinArguments) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
12: 0x1023b422c v8::internal::Builtin_HandleApiCall(int, unsigned long*, v8::internal::Isolate*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
13: 0x102af4d0c Builtins_CEntry_Return1_DontSaveFPRegs_ArgvOnStack_BuiltinExit [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
14: 0x10728bba4
15: 0x102ab7e54 Builtins_AsyncFunctionAwaitResolveClosure [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
16: 0x102b3ccf8 Builtins_PromiseFulfillReactionJob [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
17: 0x102aaa234 Builtins_RunMicrotasks [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
18: 0x102a86524 Builtins_JSRunMicrotasksEntry [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
19: 0x102457e5c v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
20: 0x102458290 v8::internal::(anonymous namespace)::InvokeWithTryCatch(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
21: 0x10245837c v8::internal::Execution::TryRunMicrotasks(v8::internal::Isolate*, v8::internal::MicrotaskQueue*, v8::internal::MaybeHandle<v8::internal::Object>*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
22: 0x10247afb8 v8::internal::MicrotaskQueue::RunMicrotasks(v8::internal::Isolate*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
23: 0x10247b84c v8::internal::MicrotaskQueue::PerformCheckpoint(v8::Isolate*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
24: 0x102a8af34 Builtins_CallApiCallback [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
25: 0x107de9560
26: 0x102a8664c Builtins_JSEntryTrampoline [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
27: 0x102a862e4 Builtins_JSEntry [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
28: 0x102457e94 v8::internal::(anonymous namespace)::Invoke(v8::internal::Isolate*, v8::internal::(anonymous namespace)::InvokeParams const&) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
29: 0x102457528 v8::internal::Execution::Call(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
30: 0x1023649b8 v8::Function::Call(v8::Local<v8::Context>, v8::Local<v8::Value>, int, v8::Local<v8::Value>*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
31: 0x102145eec node::InternalCallbackScope::Close() [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
32: 0x10214648c node::InternalMakeCallback(node::Environment*, v8::Local<v8::Object>, v8::Local<v8::Object>, v8::Local<v8::Function>, int, v8::Local<v8::Value>*, node::async_context) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
33: 0x10215b4c8 node::AsyncWrap::MakeCallback(v8::Local<v8::Function>, int, v8::Local<v8::Value>*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
34: 0x10229f8f8 node::StreamBase::CallJSOnreadMethod(long, v8::Local<v8::ArrayBuffer>, unsigned long, node::StreamBase::StreamBaseJSChecks) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
35: 0x1022a18c4 node::EmitToJSStreamListener::OnStreamRead(long, uv_buf_t const&) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
36: 0x1022a5ee4 node::LibuvStreamWrap::OnUvRead(long, uv_buf_t const*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
37: 0x102a73fb4 uv__stream_io [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
38: 0x102a7c0e8 uv__io_poll [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
39: 0x102a6a800 uv_run [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
40: 0x102146ccc node::SpinEventLoop(node::Environment*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
41: 0x102231aec node::NodeMainInstance::Run(int*, node::Environment*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
42: 0x1022317b8 node::NodeMainInstance::Run(node::EnvSerializeInfo const*) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
43: 0x1021cb5c8 node::Start(int, char**) [/Users/myuser/.nvm/versions/node/v16.16.0/bin/node]
44: 0x106c7508c
[1]    17049 abort      npm run test:memleak
```
